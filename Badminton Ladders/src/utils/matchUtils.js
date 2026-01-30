// 为4人组生成6场比赛配对
export const generateMatches = (groupId, playerIds, round) => {
  if (playerIds.length !== 4) return []
  
  const [p1, p2, p3, p4] = playerIds
  
  return [
    {
      id: `${round}-${groupId}-1`,
      round,
      groupId,
      team1: [p1, p2],
      team2: [p3, p4],
      score1: null,
      score2: null,
      completed: false
    },
    {
      id: `${round}-${groupId}-2`,
      round,
      groupId,
      team1: [p1, p3],
      team2: [p2, p4],
      score1: null,
      score2: null,
      completed: false
    },
    {
      id: `${round}-${groupId}-3`,
      round,
      groupId,
      team1: [p1, p4],
      team2: [p2, p3],
      score1: null,
      score2: null,
      completed: false
    }
  ]
}

// 计算选手统计数据
export const calculatePlayerStats = (playerId, matches) => {
  let wins = 0
  let netScore = 0
  
  matches.forEach(match => {
    if (!match.completed) return
    
    const inTeam1 = match.team1.includes(playerId)
    const inTeam2 = match.team2.includes(playerId)
    
    if (inTeam1) {
      if (match.score1 > match.score2) wins++
      netScore += (match.score1 - match.score2)
    } else if (inTeam2) {
      if (match.score2 > match.score1) wins++
      netScore += (match.score2 - match.score1)
    }
  })
  
  return { wins, netScore }
}

// 升降级处理
export const processPromotion = (groups, players, matches, currentRound) => {
  const newGroups = []
  
  // 计算每组的排名
  const groupRankings = groups.map(group => {
    const groupMatches = matches.filter(m => m.groupId === group.id && m.round === currentRound)
    
    const rankings = group.playerIds.map(playerId => {
      const stats = calculatePlayerStats(playerId, groupMatches)
      return { playerId, ...stats }
    }).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.netScore - a.netScore
    })
    
    return { groupId: group.id, rankings }
  })
  
  // 执行升降级
  const sortedGroups = [...groups].sort((a, b) => a.level - b.level)
  
  sortedGroups.forEach((group, index) => {
    const ranking = groupRankings.find(r => r.groupId === group.id)
    let newPlayerIds = [...group.playerIds]
    
    // 不是最高组，第1名升级
    if (index > 0 && ranking.rankings.length > 0) {
      const promoted = ranking.rankings[0].playerId
      newPlayerIds = newPlayerIds.filter(id => id !== promoted)
      
      // 添加到上一组
      const upperGroupIndex = newGroups.findIndex(g => g.level === group.level - 1)
      if (upperGroupIndex !== -1) {
        newGroups[upperGroupIndex].playerIds.push(promoted)
      }
    }
    
    // 不是最低组，最后一名降级
    if (index < sortedGroups.length - 1 && ranking.rankings.length > 0) {
      const relegated = ranking.rankings[ranking.rankings.length - 1].playerId
      newPlayerIds = newPlayerIds.filter(id => id !== relegated)
    }
    
    newGroups.push({
      ...group,
      playerIds: newPlayerIds
    })
    
    // 从下一组接收降级选手
    if (index < sortedGroups.length - 1) {
      const lowerRanking = groupRankings.find(r => r.groupId === sortedGroups[index + 1].id)
      if (lowerRanking && lowerRanking.rankings.length > 0) {
        const relegated = lowerRanking.rankings[lowerRanking.rankings.length - 1].playerId
        newGroups[newGroups.length - 1].playerIds.push(relegated)
      }
    }
  })
  
  return newGroups
}
