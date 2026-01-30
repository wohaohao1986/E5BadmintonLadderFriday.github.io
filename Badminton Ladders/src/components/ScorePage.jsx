import { useState } from 'react'

function ScorePage({ data, updateData }) {
  const { players, matches, currentRound } = data
  const [selectedMatch, setSelectedMatch] = useState('')
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id)
    return player ? player.name : '未知'
  }

  const currentMatches = matches.filter(m => m.round === currentRound)
  const pendingMatches = currentMatches.filter(m => !m.completed)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedMatch || !score1 || !score2) {
      alert('请填写完整信息')
      return
    }

    const s1 = parseInt(score1)
    const s2 = parseInt(score2)

    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      alert('请输入有效分数')
      return
    }

    const updatedMatches = matches.map(m => {
      if (m.id === selectedMatch) {
        return {
          ...m,
          score1: s1,
          score2: s2,
          completed: true
        }
      }
      return m
    })

    updateData({
      ...data,
      matches: updatedMatches
    })

    setSelectedMatch('')
    setScore1('')
    setScore2('')
    alert('比分已记录！')
  }

  return (
    <div>
      <h1 style={{marginBottom: '20px', color: '#4CAF50'}}>报分</h1>
      
      {pendingMatches.length === 0 ? (
        <div style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
          <p>本轮所有比赛已完成！</p>
        </div>
      ) : (
        <div style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                选择比赛
              </label>
              <select 
                value={selectedMatch}
                onChange={(e) => setSelectedMatch(e.target.value)}
                style={{width: '100%', padding: '10px'}}
              >
                <option value="">-- 请选择 --</option>
                {pendingMatches.map(match => (
                  <option key={match.id} value={match.id}>
                    {match.team1.map(id => getPlayerName(id)).join('/')}
                    {' vs '}
                    {match.team2.map(id => getPlayerName(id)).join('/')}
                  </option>
                ))}
              </select>
            </div>

            {selectedMatch && (
              <>
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                    {(() => {
                      const match = matches.find(m => m.id === selectedMatch)
                      return match ? match.team1.map(id => getPlayerName(id)).join('/') : ''
                    })()} 得分
                  </label>
                  <input 
                    type="number"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    placeholder="输入分数"
                    style={{width: '100%', padding: '10px'}}
                    min="0"
                  />
                </div>

                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                    {(() => {
                      const match = matches.find(m => m.id === selectedMatch)
                      return match ? match.team2.map(id => getPlayerName(id)).join('/') : ''
                    })()} 得分
                  </label>
                  <input 
                    type="number"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    placeholder="输入分数"
                    style={{width: '100%', padding: '10px'}}
                    min="0"
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px'
                  }}
                >
                  提交比分
                </button>
              </>
            )}
          </form>
        </div>
      )}

      <div style={{marginTop: '30px'}}>
        <h2 style={{marginBottom: '15px'}}>已完成比赛</h2>
        {currentMatches.filter(m => m.completed).map(match => (
          <div key={match.id} style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              {match.team1.map(id => getPlayerName(id)).join(' / ')}
              {' vs '}
              {match.team2.map(id => getPlayerName(id)).join(' / ')}
            </span>
            <span style={{fontWeight: 'bold', color: '#4CAF50'}}>
              {match.score1} : {match.score2}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScorePage
