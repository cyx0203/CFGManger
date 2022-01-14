import React,{useEffect} from 'react';
import { useAccess, Access, history, } from 'umi';

const Index = (props:any) => {
  
  useEffect(() => {
    return () => { };
  });

  return (
    <div>
      Index
      <img src='./assets/img/logo.svg'/>
    </div>
  );
};

export default Index;