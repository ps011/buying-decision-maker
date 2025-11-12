import { AppState, WishlistItem } from '../state/types';

export interface DecisionResult {
  verdict: 'buy' | 'wait' | 'defer';
  reason: string;
  details: string[];
}

export interface AdvisorResult {
  verdict: 'buy' | 'wait' | 'defer';
  why: string[];
  nextStep: string;
}

export function calculateDecision(state: AppState, item?: WishlistItem): DecisionResult {
  const { gutCheck, valueFilter, buckets, monthlyIncome, luxuryThreshold, currentItem } = state;
  
  const itemPrice = item?.price ?? currentItem.price;
  const itemName = item?.name ?? currentItem.name;
  const itemAge = item?.createdAt ?? Date.now();
  
  if (!itemName || itemPrice <= 0) {
    return {
      verdict: 'wait',
      reason: 'Please provide item details',
      details: ['Enter an item name and price to get a decision.'],
    };
  }

  const freedomFundMonthly = (monthlyIncome * buckets.freedomFund) / 100;
  const valueScore = [valueFilter.useOften, valueFilter.improvesDay, valueFilter.affordable].filter(Boolean).length;
  const hoursSinceAdded = (Date.now() - itemAge) / (1000 * 60 * 60);
  const isPastWaitingPeriod = hoursSinceAdded >= 48;

  const details: string[] = [];

  if (!valueFilter.affordable) {
    return {
      verdict: 'defer',
      reason: 'Affordability check failed',
      details: [
        'You indicated this would touch savings or require debt.',
        'Consider building up your Freedom Fund first.',
        `Set aside ${buckets.freedomFund}% of income (€${freedomFundMonthly.toFixed(2)}/month) until you can afford it.`,
      ],
    };
  }

  if (itemPrice > freedomFundMonthly && !isPastWaitingPeriod) {
    return {
      verdict: 'defer',
      reason: 'Price exceeds monthly Freedom Fund',
      details: [
        `Item costs €${itemPrice}, but your Freedom Fund is €${freedomFundMonthly.toFixed(2)}/month.`,
        `This purchase would require ${Math.ceil(itemPrice / freedomFundMonthly)} months of saving.`,
        'Add to wishlist and revisit after 48 hours.',
      ],
    };
  }

  if (itemPrice >= luxuryThreshold && !isPastWaitingPeriod) {
    return {
      verdict: 'wait',
      reason: '48-hour rule applies',
      details: [
        `Items over €${luxuryThreshold} require a 48-hour waiting period.`,
        `Added ${Math.floor(hoursSinceAdded)}h ago; ${Math.floor(48 - hoursSinceAdded)}h remaining.`,
        'This helps ensure you truly want it, not just in the moment.',
      ],
    };
  }

  if (gutCheck === 'yes' && valueScore >= 2) {
    details.push('✓ Gut check: You\'d want this even if nobody saw it.');
    details.push(`✓ Value filter: ${valueScore}/3 criteria met.`);
    if (valueFilter.affordable) details.push('✓ You can afford it without touching savings.');
    if (isPastWaitingPeriod) details.push('✓ Past 48-hour waiting period.');
    
    return {
      verdict: 'buy',
      reason: 'All key checks passed',
      details,
    };
  }

  if (gutCheck === 'no') {
    if (valueFilter.useOften && valueFilter.affordable) {
      return {
        verdict: 'wait',
        reason: 'Gut check failed, but practical value exists',
        details: [
          '✗ Gut check: Some external motivation detected.',
          '✓ However, you\'ll use it often and can afford it.',
          'Wait 48 hours and reassess your motivation.',
        ],
      };
    }
    return {
      verdict: 'defer',
      reason: 'Gut check failed',
      details: [
        '✗ You indicated you might not want this if nobody saw it.',
        'This suggests external pressure or status-seeking.',
        'Consider whether this aligns with your true values.',
      ],
    };
  }

  if (valueScore === 0) {
    return {
      verdict: 'defer',
      reason: 'No value criteria met',
      details: [
        'None of the three value filters passed.',
        'This purchase doesn\'t meet the basic criteria for a good decision.',
      ],
    };
  }

  if (valueScore === 1) {
    return {
      verdict: 'wait',
      reason: 'Only 1/3 value criteria met',
      details: [
        'Only one value criterion passed.',
        'Add to wishlist and reassess after 48 hours.',
        'Ask yourself: Is there a deeper reason I want this?',
      ],
    };
  }

  return {
    verdict: 'wait',
    reason: 'Not enough confidence yet',
    details: [
      'Some checks passed, but not enough for a confident "buy".',
      'Add to wishlist and revisit after 48 hours.',
    ],
  };
}

export function getAdvisorGuidance(query: string, state: AppState): AdvisorResult {
  const lowerQuery = query.toLowerCase();
  
  const riskyFinanceKeywords = ['credit', 'emi', 'debt', 'loan', 'borrow', 'installment', 'pay later'];
  const dailyUseKeywords = ['daily', 'every day', 'everyday', 'work', 'commute', 'travel', 'use often'];
  const qualityKeywords = ['warranty', 'durable', 'quality', 'repairable', 'last long', 'investment'];
  const statusKeywords = ['status', 'brand', 'limited', 'fomo', 'friends', 'everyone', 'trend', 'hype', 'flex', 'impress'];
  const saleKeywords = ['sale', 'discount', 'deal', 'offer', 'off'];
  const resaleKeywords = ['resale', 'resell', 'sell later'];

  const hasRiskyFinance = riskyFinanceKeywords.some(kw => lowerQuery.includes(kw));
  const hasDailyUse = dailyUseKeywords.some(kw => lowerQuery.includes(kw));
  const hasQuality = qualityKeywords.some(kw => lowerQuery.includes(kw));
  const hasStatus = statusKeywords.some(kw => lowerQuery.includes(kw));
  const hasSale = saleKeywords.some(kw => lowerQuery.includes(kw));
  const hasResale = resaleKeywords.some(kw => lowerQuery.includes(kw));

  const priceMatch = query.match(/€?\s?(\d+(?:,\d+)?(?:\.\d+)?)/);
  let extractedPrice = 0;
  if (priceMatch) {
    extractedPrice = parseFloat(priceMatch[1].replace(',', ''));
  }

  const why: string[] = [];
  let verdict: 'buy' | 'wait' | 'defer' = 'wait';
  let nextStep = 'Add to wishlist and revisit after 48 hours.';

  if (hasRiskyFinance) {
    verdict = 'defer';
    why.push('🚨 Risky finance: Using credit/EMI for non-essentials creates financial stress.');
    why.push('💡 Rule: Never buy discretionary items on debt.');
    why.push(`📊 Your Freedom Fund: €${((state.monthlyIncome * state.buckets.freedomFund) / 100).toFixed(2)}/month.`);
    nextStep = `Save ${state.buckets.freedomFund}% of monthly income until you can pay cash. Increase Freedom Fund % if needed.`;
    return { verdict, why, nextStep };
  }

  if (hasStatus && !hasDailyUse) {
    verdict = 'wait';
    why.push('⚠️ Status/FOMO detected: This might be driven by external validation, not genuine value.');
    why.push('❓ Gut check: Would you still want this if nobody ever saw it?');
    why.push('⏳ 48-hour rule: Let the initial excitement fade before deciding.');
    nextStep = 'Add to wishlist. If you still want it in 48 hours, reassess with the value filter.';
    return { verdict, why, nextStep };
  }

  if (hasSale && !state.valueFilter.useOften && !state.valueFilter.improvesDay) {
    verdict = 'wait';
    why.push('💸 On sale ≠ good value: A discount doesn\'t make it a smart purchase.');
    why.push('✓ Only buy if it meets your value criteria (use often, improves day, affordable).');
    nextStep = 'Evaluate against the 3-part value filter. If it fails, skip the sale.';
    return { verdict, why, nextStep };
  }

  if ((hasDailyUse || hasQuality) && state.valueFilter.affordable) {
    verdict = 'buy';
    why.push('✅ Daily use + quality/durability = strong long-term value.');
    why.push('✅ Affordability confirmed: You can pay without touching savings.');
    if (hasResale) {
      why.push('✅ Bonus: Resale value or warranty adds safety net.');
    }
    nextStep = extractedPrice >= state.luxuryThreshold
      ? `Add to wishlist for 48-hour rule (price ≥ €${state.luxuryThreshold}).`
      : 'Proceed with purchase guilt-free.';
    return { verdict, why, nextStep };
  }

  if (hasDailyUse && !state.valueFilter.affordable) {
    verdict = 'wait';
    why.push('✓ Good use case, but affordability is key.');
    why.push('💰 Check: Can you buy this with Freedom Fund without touching savings?');
    why.push(`📊 Freedom Fund: €${((state.monthlyIncome * state.buckets.freedomFund) / 100).toFixed(2)}/month.`);
    nextStep = 'If price exceeds Freedom Fund, save for a few months. If close, add to wishlist and wait 48h.';
    return { verdict, why, nextStep };
  }

  if (extractedPrice > 0) {
    if (extractedPrice >= state.luxuryThreshold) {
      why.push(`⏳ Price (€${extractedPrice}) triggers 48-hour rule (threshold: €${state.luxuryThreshold}).`);
      nextStep = 'Add to wishlist. Revisit after 48 hours to confirm you still want it.';
    } else {
      why.push(`✓ Price (€${extractedPrice}) is below luxury threshold (€${state.luxuryThreshold}).`);
    }
  }

  why.push('🤔 Not enough info to give a strong recommendation.');
  why.push('📝 Run through the full decision framework: gut check + value filter + affordability.');
  nextStep = 'Use the "Current Item" section above to evaluate this purchase systematically.';

  return { verdict, why, nextStep };
}

