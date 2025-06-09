import React, { useState } from 'react';
import axios from 'axios';

function WeatherApp() {
  const [baseDate, setBaseDate] = useState('20250523');
  const [baseTime, setBaseTime] = useState('0600');
  const [nx, setNx] = useState('55');
  const [ny, setNy] = useState('127');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const precipitationTypes = {
    '0': '없음',
    '1': '비',
    '2': '비/눈',
    '3': '눈',
    '4': '소나기',
    '5': '빗방울',
    '6': '빗방울/눈날림',
    '7': '눈날림'
  };

  const skyTypes = {
    '1': '맑음',
    '3': '구름 많음',
    '4': '흐림'
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    
    try {
      const response = await axios.get(
        `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=1IbjiCFGTRst9TKidkbE8t%2BCjIhjUXgbLsMMlvJJ6w92nsv2dcSOx5pV6n7nWzF21p26hHKIzxzenn0ljsouhQ%3D%3D&pageNo=1&numOfRows=1000&dataType=XML&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      
      const items = xmlDoc.getElementsByTagName("item");
      let ptyValue = '0';
      let skyValue = '1';
      
      for (let i = 0; i < items.length; i++) {
        const category = items[i].getElementsByTagName("category")[0].textContent;
        const obsrValue = items[i].getElementsByTagName("obsrValue")[0].textContent;
        
        if (category === "PTY") {
          ptyValue = obsrValue;
        } else if (category === "SKY") {
          skyValue = obsrValue;
        }
      }
      
      setWeatherData({
        precipitation: precipitationTypes[ptyValue] || '알 수 없음',
        sky: skyTypes[skyValue] || '알 수 없음'
      });
    } catch (err) {
      setError('날씨 정보를 가져오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>날씨 상태 확인</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            발표 날짜 (YYYYMMDD):
            <input 
              type="text" 
              value={baseDate} 
              onChange={(e) => setBaseDate(e.target.value)} 
              style={{ marginLeft: '10px' }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            발표 시간 (HHMM):
            <input 
              type="text" 
              value={baseTime} 
              onChange={(e) => setBaseTime(e.target.value)} 
              style={{ marginLeft: '10px' }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            예보지점 X 좌표:
            <input 
              type="text" 
              value={nx} 
              onChange={(e) => setNx(e.target.value)} 
              style={{ marginLeft: '10px' }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            예보지점 Y 좌표:
            <input 
              type="text" 
              value={ny} 
              onChange={(e) => setNy(e.target.value)} 
              style={{ marginLeft: '10px' }}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '조회 중...' : '날씨 상태 확인'}
        </button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {weatherData !== null && !loading && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '5px',
          textAlign: 'center',
          fontSize: '1.2em',
          marginTop: '20px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <h2>날씨 상태 결과</h2>
          <p>발표 날짜: {baseDate}</p>
          <p>발표 시간: {baseTime}</p>
          <p>예보지점 좌표: X={nx}, Y={ny}</p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around',
            marginTop: '20px'
          }}>
            <div>
              <p style={{ fontWeight: 'bold' }}>구름 상태</p>
              <p style={{ 
                color: getSkyColor(weatherData.sky),
                fontSize: '1.3em',
                marginTop: '5px'
              }}>
                {weatherData.sky}
              </p>
            </div>
            
            <div>
              <p style={{ fontWeight: 'bold' }}>강수 상태</p>
              <p style={{ 
                color: getPrecipitationColor(weatherData.precipitation),
                fontSize: '1.3em',
                marginTop: '5px'
              }}>
                {weatherData.precipitation}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// 구름 상태에 따른 색상 반환
function getSkyColor(sky) {
  switch(sky) {
    case '맑음': return '#4CAF50'; // 녹색
    case '구름 많음': return '#607D8B'; // 청회색
    case '흐림': return '#9E9E9E'; // 회색
    default: return '#000000'; // 검정색
  }
}

// 강수 상태에 따른 색상 반환
function getPrecipitationColor(precipitation) {
  switch(precipitation) {
    case '없음': return '#4CAF50'; // 녹색
    case '비':
    case '소나기':
    case '빗방울': return '#2196F3'; // 파란색
    case '눈':
    case '눈날림': return '#00BCD4'; // 시안색
    case '비/눈':
    case '빗방울/눈날림': return '#673AB7'; // 보라색
    default: return '#000000'; // 검정색
  }
}

export default WeatherApp;