import Image from "next/image";

type Props = {
  title: string;
  leftIcon?: string | null;
  rightIcon?: string | null;
  handleClick?: React.MouseEventHandler
  isSubmitting?: boolean | false;
  type?: 'button' | 'submit';
  bgColor?: string;
  textColor?: string;
}

const Button = ({ title, leftIcon, rightIcon, handleClick, isSubmitting, type, bgColor, textColor }: Props) => {
  return (
    <button
      type={type || 'button'}
      disabled={isSubmitting}
      onClick={handleClick}
      className={`flexCenter gap-3 px-4 py-3
        ${textColor || 'text-white'}
        ${isSubmitting ? 'bg-black/50' : bgColor || 'bg-primary-purple'} rounded-xl text-sm font-medium max-md:w-full
      `}
    >
      {leftIcon && <Image src={leftIcon} width={14} height={14} alt='left' />}
      {title}
      {rightIcon && <Image src={rightIcon} width={14} height={14} alt='right' />}
    </button>
  )
}

export default Button