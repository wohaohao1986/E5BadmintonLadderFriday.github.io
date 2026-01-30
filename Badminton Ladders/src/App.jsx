import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import ScorePage from './components/ScorePage'
import AdminPage from './components/AdminPage'
import { loadData, saveData } from './utils/storage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [data, setData] = useState(null)

  useEffect(() => {
    const loaded = loadData()
    setData(loaded)
  }, [])

  const updateData = (newData) => {
    setData(newData)
    saveData(newData)
  }

  if (!data) return <div style={{padding: '20px'}}>加载中...</div>

  return (
    <div style={{minHeight: '100vh', background: '#f5f5f5'}}>
      <nav style={{
        background: '#4CAF50',
        color: 'white',
        padding: '15px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setCurrentPage('home')}
          style={{
            background: currentPage === 'home' ? '#45a049' : 'white',
            color: currentPage === 'home' ? 'white' : '#4CAF50'
          }}
        >
          首页
        </button>
        <button 
          onClick={() => setCurrentPage('score')}
          style={{
            background: currentPage === 'score' ? '#45a049' : 'white',
            color: currentPage === 'score' ? 'white' : '#4CAF50'
          }}
        >
          报分
        </button>
        <button 
          onClick={() => setCurrentPage('admin')}
          style={{
            background: currentPage === 'admin' ? '#45a049' : 'white',
            color: currentPage === 'admin' ? 'white' : '#4CAF50'
          }}
        >
          管理
        </button>
      </nav>

      <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
        {currentPage === 'home' && <HomePage data={data} />}
        {currentPage === 'score' && <ScorePage data={data} updateData={updateData} />}
        {currentPage === 'admin' && <AdminPage data={data} updateData={updateData} />}
      </div>
    </div>
  )
}

export default App
