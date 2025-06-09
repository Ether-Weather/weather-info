export const getPrecipitationStatus = (code) => {
    const codes = {
      '0': '없음',
      '1': '비',
      '2': '비/눈',
      '3': '눈',
      '4': '소나기',
      '5': '빗방울',
      '6': '빗방울/눈날림',
      '7': '눈날림'
    };
    return codes[code] || '알 수 없음';
  };