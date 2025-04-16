export default function Modal({
  isOpen,
  title,
  content,
  useCancelButton = true,
  useConfirmButton = true,
  confirmText = '확인',
  mode = 'default',
  onClose = () => {},
  onConfirm = () => {},
}) {
  const confirmButtonClass =
    mode === 'error'
      ? 'btn bg-red-500 hover:bg-red-600 text-white font-pretendard rounded-2xl'
      : 'btn bg-[#1B3764] text-white font-pretendard rounded-2xl';

  return (
    <dialog className={`modal ${isOpen ? 'open' : ''}`} open={isOpen}>
      <div className="modal-box rounded-2xl">
        <h3 className="font-bold text-lg font-pretendard">{title}</h3>
        <div className="py-4 font-pretendard">{content}</div>
        <div className="modal-action">
          {useCancelButton && (
            <button
              className="btn font-pretendard rounded-2xl"
              onClick={onClose}
            >
              닫기
            </button>
          )}
          {useConfirmButton && (
            <button
              className={confirmButtonClass}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
