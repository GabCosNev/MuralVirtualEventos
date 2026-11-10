import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { GroqLlmService } from './groq-llm.service';

const NOT_FOUND_MESSAGE = 'Não encontrei eventos que correspondam ao seu pedido.';
const DEFAULT_MESSAGE = 'Aqui estão os eventos que encontrei.';

type SearchPost = Awaited<ReturnType<PostsService['findApprovedByIds']>>[number];

export interface SearchResult {
  answer: string;
  posts: SearchPost[];
}

@Injectable()
export class GroqSearchService {
  constructor(
    private postsService: PostsService,
    private llm: GroqLlmService,
  ) {}

  async search(question: string): Promise<SearchResult> {
    const intent = await this.llm.extractIntent(question);

    const candidates = await this.postsService.findApprovedForSearch(
      intent.event_type ?? undefined,
    );

    if (candidates.length === 0) {
      return { answer: NOT_FOUND_MESSAGE, posts: [] };
    }

    const selection = await this.llm.selectPosts(candidates, question);

    const selected = new Set(selection.post_ids);
    const ids = candidates.filter((p) => selected.has(p.id)).map((p) => p.id);

    if (ids.length === 0) {
      return { answer: NOT_FOUND_MESSAGE, posts: [] };
    }

    const posts = await this.postsService.findApprovedByIds(ids);

    if (posts.length === 0) {
      return { answer: NOT_FOUND_MESSAGE, posts: [] };
    }

    return {
      answer: selection.message.trim() || DEFAULT_MESSAGE,
      posts,
    };
  }
}
