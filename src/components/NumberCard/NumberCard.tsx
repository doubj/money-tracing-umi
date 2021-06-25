import React from 'react';
import { currencyFormat } from '@/utils/utility';
import styles from './index.less';

interface NumberCardProps {
  prefix: boolean;
  number: number;
  title: string;
  color: string;
}

const NumberCard: React.FC<NumberCardProps> = (props) => {
  const { number, title, color, prefix } = props;
  const currencyFormatResult = prefix
    ? currencyFormat()
    : currencyFormat('decimal');
  return (
    <>
      <div className={styles.numberCard}>
        <span style={{ color: color, fontSize: '30px', fontWeight: 500 }}>
          {currencyFormatResult.format(number)}
        </span>
        <span
          style={{
            textTransform: 'capitalize',
            color: 'rgba(0,0,0, .6)',
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>
    </>
  );
};

export default NumberCard;
