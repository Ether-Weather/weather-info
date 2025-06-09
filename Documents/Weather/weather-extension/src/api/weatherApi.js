import axios from 'axios';

const SERVICE_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const getPrecipitationData = async (baseDate, baseTime, nx, ny) => {
  try {
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${encodeURIComponent(SERVICE_KEY)}&pageNo=1&numOfRows=1000&dataType=XML&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
    
    const response = await axios.get(url, {
      headers: { 'Accept': 'application/xml' }
    });
    
    return response.data;
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};