const { createClient } = require('@supabase/supabase-js');

// 서비스 키는 절대 클라이언트로 내려가지 않고, 여기 서버 함수 안에서만 사용됩니다.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
    return;
  }

  try {
    const { email, consent_privacy, consent_marketing, utm_source, utm_medium, utm_campaign, referrer } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: '올바른 이메일을 입력해주세요.' });
      return;
    }
    if (!consent_privacy) {
      res.status(400).json({ error: '개인정보 수집·이용 동의가 필요해요.' });
      return;
    }

    const { error } = await supabase.from('signups').insert({
      email,
      consent_privacy: !!consent_privacy,
      consent_marketing: !!consent_marketing,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      referrer: referrer || null
    });

    if (error) {
      // 이메일 중복 등은 조용히 성공 처리(사용자 경험상 이미 등록됐다고 알리지 않아도 무방)
      if (error.code === '23505') {
        res.status(200).json({ ok: true, note: 'already_registered' });
        return;
      }
      console.error(error);
      res.status(500).json({ error: '저장 중 문제가 발생했어요.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했어요.' });
  }
};
