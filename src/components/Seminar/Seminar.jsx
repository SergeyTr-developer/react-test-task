import { useState, useEffect } from 'react'
import { Modal } from '../Modal/Modal'

export const Seminar = () => {
  const [seminars, setSeminars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // Для обработки ошибок
  const [isModalOpen, setIsModalOpen] = useState(false) // Для управления состоянием модального окна
  const [selectedSeminar, setSelectedSeminar] = useState(null) // Для выбранного семинара
  const [updatedTitle, setUpdatedTitle] = useState('') // Для нового названия семинара

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/seminars')

        if (!response.ok) {
          // Проверка, что запрос успешен
          throw new Error('Ошибка сети')
        }

        const data = await response.json()
        setSeminars(data) // Обновляем состояние с полученными данными
      } catch (error) {
        setError(error.message) // Если ошибка, сохраняем сообщение
      } finally {
        setLoading(false) // Завершаем процесс загрузки
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div>Ошибка: {error}</div>
  }

  const deleteSeminar = async (id) => {
    // Открыть окно подтверждения перед удалением
    const isConfirmed = window.confirm(
      'Вы уверены, что хотите удалить этот семинар?'
    )

    if (isConfirmed) {
      try {
        // Отправка запроса на удаление семинара
        const response = await fetch(`http://localhost:3001/seminars/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Ошибка при удалении семинара')
        }

        // Удаляем семинар из списка без перезагрузки данных с сервера
        setSeminars(seminars.filter((seminar) => seminar.id !== id))
      } catch (error) {
        setError(error.message) // Если ошибка, сохраняем сообщение
      }
    }
  }

  const openModal = (seminar) => {
    setSelectedSeminar(seminar)
    setUpdatedTitle(seminar.title)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSeminar(null)
    setIsModalOpen(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!updatedTitle) {
      alert('Поле "Название" обязательно для заполнения!')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3001/seminars/${selectedSeminar.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            title: updatedTitle,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Ошибка при обновлении семинара')
      }

      const updatedSeminar = await response.json()

      // Обновляем локальный список семинаров
      setSeminars(
        seminars.map((seminar) =>
          seminar.id === updatedSeminar.id ? updatedSeminar : seminar
        )
      )

      closeModal() // Закрываем модальное окно после успешного обновления
    } catch (error) {
      setError(error.message) // Если ошибка, сохраняем сообщение
    }
  }

  return (
    <>
      <h1>Семинары</h1>
      <ul>
        {seminars.map((seminar) => (
          <li key={seminar.id}>
            <h3>{seminar.title}</h3>
            <button onClick={() => openModal(seminar)}>Редактировать</button>
            <button onClick={() => deleteSeminar(seminar.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      {/* Модальное окно для редактирования */}
      {isModalOpen && (
        <Modal
          seminar={selectedSeminar}
          updatedTitle={updatedTitle}
          setUpdatedTitle={setUpdatedTitle}
          handleUpdate={handleUpdate}
          onClose={closeModal}
        />
      )}
    </>
  )
}
