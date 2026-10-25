import { getInitials } from '../utils/storage.js';

export default function Avatar({ user, size = 'md', className = '' }) {
  const image = user?.avatar?.startsWith('data:') ? user.avatar : '';
  return (
    <span className={`avatar avatar-${size} ${className}`} aria-label={user?.name || 'Student avatar'}>
      {image ? <img src={image} alt="" /> : getInitials(user?.name)}
    </span>
  );
}
