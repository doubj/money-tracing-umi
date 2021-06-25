import React from 'react';

interface EmptyDataInfoProps {
  title: string;
  style?: object;
}

// TODO: 自定义内容
const EmptyDataInfo: React.FC<EmptyDataInfoProps> = (props) => {
  const { title, style } = props;
  return (
    <div
      style={{
        ...style,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>{title}</h1>
    </div>
  );
};

export default EmptyDataInfo;
