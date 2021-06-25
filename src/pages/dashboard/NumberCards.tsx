import NumberCard from '@/components/NumberCard/NumberCard';
import { RecordType } from '@/services/transactions';
import React, { useEffect, useState } from 'react';

interface NumberCardsProps {
  records: RecordType[];
}

const NumberCards: React.FC<NumberCardsProps> = ({ records }) => {
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [expenseTotal, setExpenseTotal] = useState<number>(0);
  const [balanceTotal, setBalanceTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<number>(0);

  const calculateNumberCard = (records: RecordType[]) => {
    let _incomeTotal = 0;
    let _expenseTotal = 0;
    records.forEach((data) => {
      _incomeTotal += data.category?.type === 'income' ? data.price || 0 : 0;
      _expenseTotal += data.category?.type === 'expense' ? data.price || 0 : 0;
    });
    setIncomeTotal(_incomeTotal);
    setExpenseTotal(_expenseTotal);
    setBalanceTotal(_incomeTotal - _expenseTotal);
    setTransactions(records.length);
  };

  // TODO: 为什么这里useEffect没有出现警告，
  // 为什么这里把calculateNumberCard移出来会出现loop调用
  useEffect(() => {
    calculateNumberCard(records);
  }, [records]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <NumberCard
        prefix={true}
        number={incomeTotal}
        title={'收入'}
        color={'#74b9ff'}
      />
      <NumberCard
        prefix={true}
        number={expenseTotal}
        title={'支出'}
        color={'#fd79a8'}
      />
      <NumberCard
        prefix={true}
        number={balanceTotal}
        title={'现金'}
        color="#55efc4"
      />
      <NumberCard
        prefix={false}
        number={transactions}
        title={'交易数'}
        color={'#81ecec'}
      />
    </div>
  );
};

export default NumberCards;
