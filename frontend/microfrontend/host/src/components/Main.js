import React, {lazy} from 'react';

const ProfileControl = lazy(() => import('profile/ProfileControl').catch(() => {
  return {
    default: () => <div className='error'>Component is not available!</div>
  };
}));

const CardsControl = lazy(() => import('card/CardsControl').catch(() => {
  return {
    default: () => <div className='error'>Component is not available!</div>
  };
}));

function Main({currentUser}) {
  return (
    <main className="content">
      <ProfileControl/>
      <CardsControl currentUser={currentUser}/>
    </main>
  );
}

export default Main;
