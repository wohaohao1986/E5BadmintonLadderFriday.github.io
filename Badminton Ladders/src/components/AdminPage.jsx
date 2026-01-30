import { useState } from 'react'
import { generateMatches, processPromotion } from '../utils/matchUtils'

function AdminPage({ data, updateData }) {
  const { players, groups, matches, currentRound } = data
  const [newPlayerName, setNewPlayerName] = useState('')
  const [showGroupForm, setShowGroupForm] = useState(false)

  // 添加选手
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('请输入选手姓名')
      return
    }

    const newPlayer = {
      id: `player-${Date.now()}`,
      name: newPlayerName.trim()
    }

    updateData({
      ...data,
      players: [...players, newPlayer]
    })

    setNewPlayerName('')
    alert('选手已添加！')
  }

  // 自动分组（初始化或重新分组）
  const handleAutoGroup = () => {
    if (players.length < 4) {
      alert('至少需要4名选手才能分组')
      return
    }

    const groupSize = 4
    const numGroups = Math.floor(players.length / groupSize)
    
    if (numGroups === 0) {
      alert('选手数量不足以分组')
      return
    }

    // 简单分组：按现有顺序分配
    const newGroups = []
    const shuffledPlayers = [...players]
    
    for (let i = 0; i < numGroups; i++) {
      const groupPlayers = shuffledPlayers.slice(i * groupSize, (i + 1) * groupSize)
      newGroups.push({
        id: `group-${i + 1}`,
        level: i + 1,
        playerIds: groupPlayers.map(p => p.id)
      })
    }

    // 生成比赛
    const newMatches = []
    newGroups.forEach(group => {
      const groupMatches = generateMatches(group.id, group.playerIds, currentRound)
      newMatches.push(...groupMatches)
    })

    updateData({
      ...data,
      groups: newGroups,
      matches: [...matches, ...newMatches]
    })

    alert(`已创建 ${numGroups} 个组，共 ${newMatches.length} 场比赛`)
  }

  // 升降级并开始新一轮
  const handlePromotionAndNewRound = () => {
    const currentMatches = matches.filter(m => m.round === currentRound)
    const allCompleted = currentMatches.every(m => m.completed)

    if (!allCompleted) {
      alert('本轮比赛尚未全部完成，无法进行升降级')
      return
    }

    if (groups.length === 0) {
      alert('没有分组信息')
      return
    }

    // 执行升降级
    const newGroups = processPromotion(groups, players, matches, currentRound)
    
    // 生成新一轮比赛
    const newRound = currentRound + 1
    const newMatches = []
    newGroups.forEach(group => {
      if (group.playerIds.length === 4) {
        const groupMatches = generateMatches(group.id, group.playerIds, newRound)
        newMatches.push(...groupMatches)
      }
    })

    updateData({
      ...data,
      groups: newGroups,
      matches: [...matches, ...newMatches],
      currentRound: newRound
    })

    alert(`升降级完成！已开始第 ${newRound} 轮`)
  }

  // 删除选手
  const handleDeletePlayer = (playerId) => {
    if (!confirm('确定要删除这名选手吗？')) return

    updateData({
      ...data,
      players: players.filter(p => p.id !== playerId)
    })
  }

  return (
    <div>
      <h1 style={{marginBottom: '20px', color: '#4CAF50'}}>管理面板</h1>

      {/* 添加选手 */}
      <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
        <h2 style={{marginBottom: '15px'}}>添加选手</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <input 
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="输入选手姓名"
            style={{flex: 1, padding: '10px'}}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
          />
          <button 
            onClick={handleAddPlayer}
            style={{background: '#4CAF50', color: 'white'}}
          >
            添加
          </button>
        </div>
      </div>

      {/* 选手列表 */}
      <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
        <h2 style={{marginBottom: '15px'}}>选手列表 ({players.length}人)</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px'}}>
          {players.map(player => (
            <div key={player.id} style={{
              padding: '10px',
              background: '#f5f5f5',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{player.name}</span>
              <button 
                onClick={() => handleDeletePlayer(player.id)}
                style={{background: '#f44336', color: 'white', padding: '5px 10px', fontSize: '12px'}}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 分组操作 */}
      <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
        <h2 style={{marginBottom: '15px'}}>分组管理</h2>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button 
            onClick={handleAutoGroup}
            style={{background: '#2196F3', color: 'white'}}
          >
            自动分组（4人一组）
          </button>
          <button 
            onClick={handlePromotionAndNewRound}
            style={{background: '#FF9800', color: 'white'}}
          >
            升降级并开始新一轮
          </button>
        </div>
        
        {groups.length > 0 && (
          <div style={{marginTop: '20px'}}>
            <h3 style={{marginBottom: '10px'}}>当前分组</h3>
            {groups.sort((a, b) => a.level - b.level).map(group => (
              <div key={group.id} style={{
                padding: '10px',
                background: '#f5f5f5',
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                <strong>第 {group.level} 组：</strong>
                {group.playerIds.map(id => {
                  const player = players.find(p => p.id === id)
                  return player ? player.name : '未知'
                }).join(', ')}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
        <h2 style={{marginBottom: '15px'}}>统计信息</h2>
        <p>当前轮次：第 {currentRound} 轮</p>
        <p>总选手数：{players.length} 人</p>
        <p>分组数：{groups.length} 组</p>
        <p>本轮比赛：{matches.filter(m => m.round === currentRound).length} 场</p>
        <p>已完成：{matches.filter(m => m.round === currentRound && m.completed).length} 场</p>
      </div>
    </div>
  )
}

export default AdminPage
