

export const transCentMoney = centMoney =>
  (centMoney && (parseInt(centMoney, 10) / 100).toFixed(2));

export const fixedMoney = money =>
  (money && parseFloat(money).toFixed(2));
