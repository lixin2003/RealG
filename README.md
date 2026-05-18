# RealG

## 娱乐排行榜接入

当前项目已经接好了前端提交流程和 Vercel API，你还需要自己完成下面几步：

1. 创建一个 Supabase 项目
2. 在 Supabase SQL Editor 里执行这段建表语句

```sql
create table public.scores (
  id bigserial primary key,
  player_id varchar(40) not null,
  level_id varchar(32) not null,
  clear_time_ms integer not null,
  created_at timestamptz not null default now()
);

create index scores_level_time_idx
on public.scores (level_id, clear_time_ms, created_at);
```

3. 在 Vercel 项目的 Environment Variables 里配置

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_SCORE_TABLE=scores
```

4. 重新部署项目

完成后，第二关通关时就可以：
- 输入玩家 ID
- 提交娱乐性成绩
- 查看排行榜

说明：
- 目前排行榜只记录第二关 `stage-2`
- 同一个玩家多次提交时，排行榜展示该玩家的最好成绩
- 这是娱乐性排行榜，前端时间可以被伪造，不做防作弊
