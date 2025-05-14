import { useState } from 'react';
import styled from 'styled-components';

const ManageUserContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ManageUserSearchSection = styled.div`
  margin-bottom: 2rem;
`;

const ManageUserForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ManageUserInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  flex: 1;
`;

const ManageUserButton = styled.button`
  padding: 0.75rem 1.5rem;
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

const ManageUserInfo = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  margin-top: 1rem;
`;

const ManageUserRecordForm = styled.form`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
`;

const GameButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #017355;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin: 0.5rem;
  min-width: 120px;
  
  &:hover {
    background-color: #00503b;
  }
`;

const GameButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ScoreInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100px;
  margin: 0 0.5rem;
`;

const GameScoreForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

function ManageUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showGameButtons, setShowGameButtons] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [score, setScore] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setUser(null);
    setShowGameButtons(false);
    setSelectedGame('');
    setScore('');

    try {
      const response = await fetch(`https://0by7j8suf2.execute-api.ap-northeast-2.amazonaws.com/proxy/api/users/${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_APP_TOKEN}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '사용자를 찾을 수 없습니다.');
      }

      setUser({
        userId: data.userId,
        nickname: data.nickname,
        phoneNumber: data.phone
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGameSelect = (gameName) => {
    setSelectedGame(gameName);
    setScore('');
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!score || isNaN(score)) {
      setError('유효한 점수를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('https://0by7j8suf2.execute-api.ap-northeast-2.amazonaws.com/proxy/api/scores/force', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_APP_TOKEN}`
        },
        body: JSON.stringify({
          gameName: selectedGame,
          userId: user.userId,
          score: parseFloat(score)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '기록 수정에 실패했습니다.');
      }

      alert('기록이 성공적으로 수정되었습니다.');
      setSelectedGame('');
      setScore('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ManageUserContainer>
      <h1>사용자 관리</h1>
      
      <ManageUserSearchSection>
        <ManageUserForm onSubmit={handleSearch}>
          <ManageUserInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="사용자 코드 4자리 입력"
            required
          />
          <ManageUserButton type="submit">검색</ManageUserButton>
        </ManageUserForm>
      </ManageUserSearchSection>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {user && (
        <ManageUserInfo>
          <h2>사용자 정보</h2>
          <p><strong>사용자 코드:</strong> {user.userId}</p>
          <p><strong>닉네임:</strong> {user.nickname}</p>
          <p><strong>전화번호:</strong> {user.phoneNumber}</p>
          
          {!showGameButtons ? (
            <ManageUserButton 
              onClick={() => setShowGameButtons(true)}
              style={{ marginTop: '1rem' }}
            >
              유저 기록 수정
            </ManageUserButton>
          ) : (
            <>
              <h3 style={{ marginTop: '1rem' }}>게임 선택</h3>
              <GameButtonContainer>
                <GameButton onClick={() => handleGameSelect('keyzzle')}>Keyzzle</GameButton>
                <GameButton onClick={() => handleGameSelect('allcll')}>올클</GameButton>
                <GameButton onClick={() => handleGameSelect('pikachu-volley')}>피배</GameButton>
                <GameButton onClick={() => handleGameSelect('greeny-neck')}>목 늘리기</GameButton>
              </GameButtonContainer>

              {selectedGame && (
                <GameScoreForm onSubmit={handleScoreSubmit}>
                  <label>
                    {selectedGame === 'keyzzle' && 'Keyzzle'}
                    {selectedGame === 'allcll' && '올클'}
                    {selectedGame === 'pikachu-volley' && '피배'}
                    {selectedGame === 'greeny-neck' && '목 늘리기'}
                    {' 점수:'}
                  </label>
                  <ScoreInput
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="점수 입력"
                    required
                    min="0"
                    step="0.01"
                  />
                  <GameButton type="submit">기록 수정</GameButton>
                  <GameButton 
                    type="button" 
                    onClick={() => {
                      setSelectedGame('');
                      setScore('');
                    }}
                    style={{ backgroundColor: '#6c757d' }}
                  >
                    취소
                  </GameButton>
                </GameScoreForm>
              )}
            </>
          )}
        </ManageUserInfo>
      )}
    </ManageUserContainer>
  );
}

export default ManageUser; 