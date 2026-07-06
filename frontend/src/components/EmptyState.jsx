const EmptyState = ({ emoji = '🌿', message = 'Nothing here yet', subMessage = '' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{emoji}</div>
      <p style={{ color: '#7a5c52', fontWeight: '600', fontSize: '1rem', margin: 0 }}>{message}</p>
      {subMessage && (
        <p style={{ color: '#9e7b6b', fontSize: '0.85rem', marginTop: '0.4rem' }}>{subMessage}</p>
      )}
    </div>
  );
};
// this is for editincuurent transaction
export default EmptyState;