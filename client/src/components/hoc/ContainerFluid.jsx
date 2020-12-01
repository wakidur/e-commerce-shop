import React from 'react';

const ContainerFluid = ({ children }) => {
  return (
    <div class="container-fluid">
      <div class="row">{children}</div>
    </div>
  );
};

export default ContainerFluid;
