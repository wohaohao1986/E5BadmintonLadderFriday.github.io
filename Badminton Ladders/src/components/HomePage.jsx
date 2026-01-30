import { calculatePlayerStats } from '../utils/matchUtils'

function HomePage({ data }) {
  const { players, groups, matches, currentRound } = data

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id)
    return player ? player.name : '未知'
  }

  const currentMatches = matches.filter(m => m.round === currentRound)

  return (
    <div>
      <h1 style={{marginBottom: '20px', color: '#4CAF50'}}>羽毛球 Ladder League - 第 {currentRound} 轮</h1>
      
      {groups.length === 0 ? (
        <div style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
          <p>暂无分组，请前往管理页面创建选手和分组</p>
        </div>
      ) : (
        groups.sort((a, b) => a.level - b.level).map(group => {
          const groupMatches = currentMatches.filter(m => m.groupId === group.id)
          
          const rankings = group.playerIds.map(playerId => {
            const stats = calculatePlayerStats(playerId, groupMatches)
            return {
              id: playerId,
              name: getPlayerName(playerId),
              ...stats
            }
          }).sort((a, b) => {
            if (b.wins !== a.wins) return b.wins - a.wins
            return b.netScore - a.netScore
          })

          return (
            <div key={group.id} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{marginBottom: '15px', color: '#333'}}>
                第 {group.level} 组
              </h2>
              
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f5f5f5'}}>
                    <th style={{padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>排名</th>
                    <th style={{padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>选手</th>
                    <th style={{padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd'}}>胜场</th>
                    <th style={{padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd'}}>净胜分</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((player, index) => (
                    <tr key={player.id}>
                      <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{index + 1}</td>
                      <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{player.name}</td>
                      <td style={{padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee'}}>{player.wins}</td>
                      <td style={{padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee'}}>
                        {player.netScore > 0 ? '+' : ''}{player.netScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{marginTop: '20px'}}>
                <h3 style={{marginBottom: '10px', fontSize: '16px'}}>本组比赛</h3>
                {groupMatches.map(match => (
                  <div key={match.id} style={{
                    padding: '10px',
                    background: match.completed ? '#e8f5e9' : '#fff3e0',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>
                      {match.team1.map(id => getPlayerName(id)).join(' / ')}
                      {' vs '}
                      {match.team2.map(id => getPlayerName(id)).join(' / ')}
                    </span>
                    <span style={{fontWeight: 'bold'}}>
                      {match.completed ? `${match.score1} : ${match.score2}` : '待比赛'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default HomePage
