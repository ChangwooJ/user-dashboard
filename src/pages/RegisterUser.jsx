import { useState } from 'react';
import styled from 'styled-components';

const RegisterUserContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const RegisterUserForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RegisterUserInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const RegisterUserButton = styled.button`
  padding: 0.75rem;
  background-color: #017355;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #00503b;
  }
`;

const RegisterUserTokenDisplay = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  word-break: break-all;
`;

function RegisterUser() {
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '010-'
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '').substring(3);
    
    let formatted = '010-' + numbers;
    
    if (formatted.length > 8) {
      formatted = formatted.substring(0, 8) + '-' + formatted.substring(8);
    }
    
    return formatted.substring(0, 13);
  };

  const handlePhoneFocus = (e) => {
    e.target.setSelectionRange(4, 4);
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    
    if (!value.startsWith('010-')) {
      setFormData(prev => ({
        ...prev,
        phone: '010-'
      }));
      setTimeout(() => {
        e.target.setSelectionRange(4, 4);
      }, 0);
      return;
    }
    
    const formattedValue = formatPhoneNumber(value);
    
    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("api호출됨");
    try {
      const response = await fetch('https://0by7j8suf2.execute-api.ap-northeast-2.amazonaws.com/proxy/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_APP_TOKEN}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '사용자 등록에 실패했습니다.');
      }
      
      setRegisteredUser({
        userId: data.userId,
        nickname: formData.nickname,
        phone: formData.phone
      });
      setToken(data.userId);
      
      setFormData({
        nickname: '',
        phone: '010-'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      handlePhoneChange(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <RegisterUserContainer>
      <h1>새 사용자 등록</h1>
      <RegisterUserForm onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickname">닉네임 (이름):</label>
          <RegisterUserInput
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone">전화번호:</label>
          <RegisterUserInput
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onFocus={handlePhoneFocus}
            required
            placeholder="010-0000-0000"
            maxLength={13}
          />
        </div>
        
        <RegisterUserButton type="submit">등록하기</RegisterUserButton>
      </RegisterUserForm>

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {registeredUser && (
        <RegisterUserTokenDisplay>
          <h3>사용자 등록 완료</h3>
          <p><strong>사용자 코드:</strong> {registeredUser.userId}</p>
          <p><strong>닉네임:</strong> {registeredUser.nickname}</p>
          <p><strong>전화번호:</strong> {registeredUser.phone}</p>
          <p style={{ marginTop: '1rem', color: '#017355', fontWeight: 'bold' }}>
            위 사용자 코드를 메모해주세요!
          </p>
        </RegisterUserTokenDisplay>
      )}
    </RegisterUserContainer>
  );
}

export default RegisterUser; 