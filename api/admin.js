const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
    return;
  }

  const { password } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: '비밀번호가 올바르지 않아요.' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('signups')
      .select('id, email, consent_marketing, utm_source, utm_medium, utm_campaign, referrer, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      res.status(500).json({ error: '조회 중 문제가 발생했어요.' });
      return;
    }

    const byChannel = {};
    for (const row of data) {
      const key = row.utm_source || '(출처 없음)';
      byChannel[key] = (byChannel[key] || 0) + 1;
    }

    res.status(200).json({
      total: data.length,
      byChannel,
      rows: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했어요.' });
  }
};
