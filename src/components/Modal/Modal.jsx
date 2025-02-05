import './Modal.css'

/**
 * Модальное окно для редактирования семинара.
 *
 * @param {object} props - Свойства компонента.
 * @param {string} props.updatedTitle - Обновленное название семинара.
 * @param {function} props.setUpdatedTitle - Функция для обновления названия семинара.
 * @param {function} props.handleUpdate - Функция для обработки обновления семинара.
 * @param {function} props.onClose - Функция для закрытия модального окна.
 * @returns {JSX.Element} Элемент JSX для модального окна.
 */

export const Modal = ({
  updatedTitle,
  setUpdatedTitle,
  handleUpdate,
  onClose,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Редактировать семинар</h2>
        <form onSubmit={handleUpdate}>
          <div>
            <label>Название</label>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </div>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>
            Закрыть
          </button>
        </form>
      </div>
    </div>
  )
}
