import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { GroqLlmService } from './groq-llm.service';

const NOT_FOUND_MESSAGE = 'Não encontrei eventos que correspondam ao seu pedido.';
const DEFAULT_MESSAGE = 'Aqui estão os eventos que encontrei.';

export interface SearchResult {
  answer: string;
  postIds: number[];
}

@Injectable()
export class GroqSearchService {
  constructor(
    private postsService: PostsService,
    private llm: GroqLlmService,
  ) {}

  async search(question: string): Promise<SearchResult> {
    const intent = await this.llm.extractIntent(question);

    const posts = await this.postsService.findApprovedForSearch(intent.event_type ?? undefined);

    if (posts.length === 0) {
      return { answer: NOT_FOUND_MESSAGE, postIds: [] };
    }

    const selection = await this.llm.selectPosts(posts, question);

    const selected = new Set(selection.post_ids);
    const ids = posts.filter((p) => selected.has(p.id)).map((p) => p.id);

    if (ids.length === 0) {
      return { answer: NOT_FOUND_MESSAGE, postIds: [] };
    }

    return {
      answer: selection.message.trim() || DEFAULT_MESSAGE,
      postIds: ids,
    };
  }
}
