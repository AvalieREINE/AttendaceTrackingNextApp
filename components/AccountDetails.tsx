import { useRouter } from 'next/router';

import React, { useState } from 'react';

function AccountDetails() {
  const router = useRouter();

  return (
    <div className="flex-row  justify-self-center place-self-center ">
      <p>username</p>
    </div>
  );
}

export default AccountDetails;
