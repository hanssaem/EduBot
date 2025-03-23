export default function Modal({
  isOpen,
  setIsOpen,
  title,
  content,
  useCancelButton = true,
  useConfirmButton = true,
  confirmText = '확인',
  onConfirm = () => {},
}) {
  return (
    <dialog className={`modal ${isOpen ? 'open' : ''}`} open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg font-pretendard">{title}</h3>
        <div className="py-4 font-pretendard">{content}</div>
        <div className="modal-action">
          {useCancelButton && (
            <button
              className="btn font-pretendard"
              onClick={() => setIsOpen(false)}
            >
              닫기
            </button>
          )}
          {useConfirmButton && (
            <button
              className="btn bg-[#1B3764] text-white font-pretendard"
              onClick={() => {
                onConfirm();
                setIsOpen(false);
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
