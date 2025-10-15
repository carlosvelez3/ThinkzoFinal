import { BaseApiService, RequestConfig } from './BaseApiService';
import type {
  ContactSubmissionRow,
  ContactSubmissionInsert,
  ContactSubmissionUpdate,
  ApiResponse
} from '../../types/database.types';

export interface SubmissionsQuery {
  status?: 'new' | 'contacted' | 'completed' | 'spam';
  projectType?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}

export class SubmissionsService extends BaseApiService {
  private readonly tableName = 'contact_submissions';

  async getSubmissions(
    query?: SubmissionsQuery,
    config?: RequestConfig
  ): Promise<ApiResponse<ContactSubmissionRow[]>> {
    try {
      let queryBuilder = this.client
        .from(this.tableName)
        .select('*');

      if (query?.status) {
        queryBuilder = queryBuilder.eq('status', query.status);
      }

      if (query?.projectType) {
        queryBuilder = queryBuilder.eq('project_type', query.projectType);
      }

      if (query?.orderBy) {
        queryBuilder = queryBuilder.order(
          query.orderBy,
          { ascending: query.orderDirection === 'asc' }
        );
      } else {
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
      }

      if (query?.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      if (query?.offset) {
        queryBuilder = queryBuilder.range(
          query.offset,
          query.offset + (query.limit || 10) - 1
        );
      }

      const result = await this.executeWithRetry(
        async () => await queryBuilder,
        config
      );

      if (result.error) {
        throw this.handleSupabaseError(result.error, {
          action: 'get_submissions',
          query
        });
      }

      return this.transformResponse(result.data || []);
    } catch (error) {
      return this.transformError(error, { action: 'get_submissions' });
    }
  }

  async getSubmissionById(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ContactSubmissionRow | null>> {
    try {
      const result = await this.executeWithRetry(
        async () => await this.client
          .from(this.tableName)
          .select('*')
          .eq('id', id)
          .maybeSingle(),
        config
      );

      if (result.error) {
        throw this.handleSupabaseError(result.error, {
          action: 'get_submission_by_id',
          submissionId: id
        });
      }

      return this.transformResponse(result.data);
    } catch (error) {
      return this.transformError(error, { action: 'get_submission_by_id', submissionId: id });
    }
  }

  async createSubmission(
    submission: ContactSubmissionInsert,
    config?: RequestConfig
  ): Promise<ApiResponse<ContactSubmissionRow>> {
    try {
      const result = await this.executeWithRetry(
        async () => await this.client
          .from(this.tableName)
          .insert(submission)
          .select()
          .single(),
        config
      );

      if (result.error) {
        throw this.handleSupabaseError(result.error, {
          action: 'create_submission',
          email: submission.email
        });
      }

      return this.transformResponse(result.data);
    } catch (error) {
      return this.transformError(error, { action: 'create_submission' });
    }
  }

  async updateSubmission(
    id: string,
    updates: ContactSubmissionUpdate,
    config?: RequestConfig
  ): Promise<ApiResponse<ContactSubmissionRow>> {
    try {
      const result = await this.executeWithRetry(
        async () => await this.client
          .from(this.tableName)
          .update(updates)
          .eq('id', id)
          .select()
          .single(),
        config
      );

      if (result.error) {
        throw this.handleSupabaseError(result.error, {
          action: 'update_submission',
          submissionId: id
        });
      }

      return this.transformResponse(result.data);
    } catch (error) {
      return this.transformError(error, { action: 'update_submission', submissionId: id });
    }
  }

  async updateSubmissionStatus(
    id: string,
    status: 'new' | 'contacted' | 'completed' | 'spam',
    config?: RequestConfig
  ): Promise<ApiResponse<ContactSubmissionRow>> {
    return this.updateSubmission(id, { status }, config);
  }

  async deleteSubmission(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<void>> {
    try {
      const result = await this.executeWithRetry(
        async () => await this.client
          .from(this.tableName)
          .delete()
          .eq('id', id),
        config
      );

      if (result.error) {
        throw this.handleSupabaseError(result.error, {
          action: 'delete_submission',
          submissionId: id
        });
      }

      return this.transformResponse(undefined);
    } catch (error) {
      return this.transformError(error, { action: 'delete_submission', submissionId: id });
    }
  }

  async getSubmissionCount(
    status?: 'new' | 'contacted' | 'completed' | 'spam',
    config?: RequestConfig
  ): Promise<ApiResponse<number>> {
    try {
      let queryBuilder = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (status) {
        queryBuilder = queryBuilder.eq('status', status);
      }

      const result = await this.executeWithRetry(
        async () => await queryBuilder,
        config
      );

      if (result.error) {
        throw this.handleSupabaseError(result.error, {
          action: 'get_submission_count',
          status
        });
      }

      return this.transformResponse(result.count || 0);
    } catch (error) {
      return this.transformError(error, { action: 'get_submission_count' });
    }
  }

  async searchSubmissions(
    searchTerm: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ContactSubmissionRow[]>> {
    try {
      const result = await this.executeWithRetry(
        async () => await this.client
          .from(this.tableName)
          .select('*')
          .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false }),
        config
      );

      if (result.error) {
        throw this.handleSupabaseError(result.error, {
          action: 'search_submissions',
          searchTerm
        });
      }

      return this.transformResponse(result.data || []);
    } catch (error) {
      return this.transformError(error, { action: 'search_submissions' });
    }
  }
}

export const submissionsService = new SubmissionsService();
