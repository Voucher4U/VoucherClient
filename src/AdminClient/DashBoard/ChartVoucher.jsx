  import { memo, useState, useEffect } from 'react';
  import { Line } from 'react-chartjs-2'; // Giữ nguyên Line
  import { Chart } from 'chart.js/auto';

  const ChartVoucher = () => {
    const [history, setHistory] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [voucherStatistics, setVoucherStatistics] = useState({});

    const fetchHistory = async () => {
      try {
        const res = await fetch('https://server-voucher.vercel.app/api/Statistical_Voucher');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setHistory(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchHistory();
    }, []);

    const calculateVoucherStatistics = (history) => {
      const voucherStats = {};

      history.forEach(item => {
        const { Voucher_ID, TotalDiscount } = item;

        if (voucherStats[Voucher_ID]) {
          voucherStats[Voucher_ID].totalValue += TotalDiscount;
          voucherStats[Voucher_ID].count += 1;
        } else {
          voucherStats[Voucher_ID] = {
            totalValue: TotalDiscount,
            count: 1,
          };
        }
      });

      return voucherStats;
    };

    useEffect(() => {
      if (history) {
        const stats = calculateVoucherStatistics(history);
        setVoucherStatistics(stats);
        console.log(stats);
      }
    }, [history]);

    if (isLoading) {
      return (
        <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
          Error: {error}
        </div>
      );
    }

    if (!history || history.length === 0) return <div>No data available.</div>;

    const uniqueVoucherIDs = new Set();
    const chartData = {
      labels: [],
      datasets: [
        {
          label: 'Số lượng Voucher',
          data: [],
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };

    history.forEach(item => {
      const { Voucher_ID } = item;

      if (!uniqueVoucherIDs.has(Voucher_ID)) {
        uniqueVoucherIDs.add(Voucher_ID);
        chartData.labels.push(Voucher_ID);
        chartData.datasets[0].data.push(voucherStatistics[Voucher_ID]?.count || 0);
      }
    });

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true, // Bắt đầu trục Y từ 0
        },
      },
      maintainAspectRatio: false, // Vô hiệu hóa tỷ lệ cố định, cho phép thay đổi kích thước
    };
    
    return (
      <div className=' xl:w-full  h-[300px]'> {/* Điều chỉnh kích thước container */}
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };

  export default memo(ChartVoucher);
