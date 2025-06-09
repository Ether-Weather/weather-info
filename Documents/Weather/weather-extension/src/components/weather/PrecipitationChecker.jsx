import React, { useState } from 'react';
import { getPrecipitationData } from '../../api/weatherApi';
import { parseWeatherXml } from '../../utils/xmlParser';
import { getPrecipitationStatus } from '../../constants/weatherCodes';
import WeatherDisplay from './WeatherDisplay';
import Button from '../common/Button';
import Input from '../common/Input';

const PrecipitationChecker = () => {
  const [inputs, setInputs] = useState({
    baseDate: '20250523',
    baseTime: '0600',
    nx: '55',
    ny: '127'
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const xmlData = await getPrecipitationData(
        inputs.baseDate, 
        inputs.baseTime, 
        inputs.nx, 
        inputs.ny
      );
      
      const ptyValue = parseWeatherXml(xmlData, 'PTY');
      const precipitation = getPrecipitationStatus(ptyValue);
      
      setWeather({
        ...inputs,
        precipitation
      });
    } catch (err) {
      setError('날씨 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="precipitation-checker">
      <h2>강수 상태 조회</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="발표 날짜 (YYYYMMDD)"
          name="baseDate"
          value={inputs.baseDate}
          onChange={handleChange}
          placeholder="예: 20250523"
        />
        {/* 다른 입력 필드들도 유사하게 구성 */}
        <Button type="submit" disabled={loading}>
          {loading ? '조회 중...' : '강수 상태 조회'}
        </Button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {weather && <WeatherDisplay data={weather} />}
    </div>
  );
};

export default PrecipitationChecker;