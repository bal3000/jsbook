interface ActionButtonProps {
  iconClass: string;
  onButtonClick: () => void;
}

function ActionButton({ iconClass, onButtonClick }: ActionButtonProps) {
  return (
    <button className='button is-primary is-small' onClick={onButtonClick}>
      <span className='icon'>
        <i className={`fas ${iconClass}`}></i>
      </span>
    </button>
  );
}

export default ActionButton;
