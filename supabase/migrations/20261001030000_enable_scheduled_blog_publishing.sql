-- Publish due blog posts automatically once a minute.
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'publish-scheduled-blog-posts',
  '* * * * *',
  'SELECT public.publish_scheduled_posts();'
);
