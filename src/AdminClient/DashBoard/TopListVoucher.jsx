import React, { useState, useEffect } from 'react';

const TopListVoucher = () => {
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

    // Sắp xếp voucherStatistics theo số lượt sử dụng (count)
    const sortedStatistics = Object.entries(voucherStatistics).sort((a, b) => b[1].count - a[1].count);

    return (
        <div>
            <table className='w-full'>
                <thead>
                    <tr className='bg-green-400 text-white'>
                        <th>Top</th> {/* Thêm cột Top */}
                        <th>Mã Voucher</th>
                        <th>Tổng giá trị</th>
                        <th>Số lượng sử dụng</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStatistics.map(([voucherID, stats], index) => (
                        <tr key={voucherID}>
                            <td className="border px-4 py-2 text-center">{index + 1}</td> {/* Thêm thứ hạng */}
                            <td className="border px-4 py-2 text-right">{voucherID}</td>
                            <td className="border px-4 py-2 text-right">{stats.totalValue} VNĐ</td>
                            <td className="border px-4 py-2 text-right">{stats.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopListVoucher;
