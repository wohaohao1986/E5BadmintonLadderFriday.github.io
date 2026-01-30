const STORAGE_KEY = 'badminton_ladder_data'

const initialData = {
  players: [],
  groups: [],
  matches: [],
  currentRound: 1
}

export const loadData = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : initialData
}

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const resetData = () => {
  localStorage.removeItem(STORAGE_KEY)
  return initialData
}
