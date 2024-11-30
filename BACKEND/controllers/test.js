const placeOrderWithRiskProfile = async (data) => {
    try {
        // Fetch the active risk profile
        const riskProfile = await fetchRiskProfile();
        
        // Validate takeProfit and stopLoss
        validateTakeProfitStopLoss(data);

        // Calculate risk-to-reward ratio
        const riskRewardRatio = calculateRiskRewardRatio(data, riskProfile);

        // Fetch active orders
        await fetchActiveOrders();

        // Fetch account balance and get USDT balance
        const usdtBalance = await fetchUsdtBalance();

        let adjustedRisk = riskProfile.initialRiskPerTrade;
        
        // Check if this is the first trade or reset is required
        adjustedRisk = resetTradeSequence(adjustedRisk, riskProfile);

        // Fetch ticker precision
        const precision = await getPrecisionFromTicker(data.symbol);

        // Calculate position size
        const newQty = calculatePositionSize(adjustedRisk, usdtBalance, data.price, data.stopLoss, precision);

        // Assign the calculated quantity to the order
        data.qty = newQty;

        console.log(`Order quantity adjusted to: ${newQty}`);
        adjustedRiskArray.push(adjustedRisk);

        // Place the order
        await simplePlaceOrder(data);

        console.log("Order placed successfully.");
    } catch (error) {
        throwError(`Error in placeOrderWithRiskProfile: ${error.message}`);
    }
};
