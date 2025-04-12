
// Types for credit scoring rules
export interface CreditCondition {
  name: string;
  description?: string;
  value: number;
  operator: string;
  apply_score_adjustment?: boolean;
}

export interface ConditionGroup {
  operation: "AND" | "OR";
  values: CreditCondition[];
}

export interface ScoreAdjustment {
  years_range: { begin: number; end: number };
  score_to_subtract: number;
  string: string;
}

export interface CreditRating {
  common_conditions: ConditionGroup;
  score_adjustment?: ScoreAdjustment[];
  paynet?: ConditionGroup;
  dnb?: ConditionGroup;
  experian?: ConditionGroup;
  equifax?: ConditionGroup;
  [key: string]: ConditionGroup | ScoreAdjustment[] | undefined;
}

export interface CreditRules {
  ratings: {
    [key: string]: CreditRating;
  };
}

// Convert YAML-like data to flow nodes and edges
export const parseRulesToFlow = (rules: CreditRules) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Add root node
  nodes.push({
    id: "root",
    type: "flowRoot",
    position: { x: 400, y: 50 },
    data: { label: "Credit Rating Rules" },
    style: {
      width: 180,
      backgroundColor: "#f8fafc",
      borderColor: "#64748b",
      borderWidth: 2,
    },
  });
  
  // Rating colors
  const ratingColors: { [key: string]: string } = {
    "AA": "#15803d", // green-700
    "A": "#65a30d",  // lime-600
    "B": "#ca8a04",  // yellow-600
    "C": "#ea580c",  // orange-600
    "D": "#dc2626",  // red-600
  };
  
  // Rating descriptions
  const ratingDescriptions: { [key: string]: string } = {
    "AA": "Prime",
    "A": "Strong",
    "B": "Good",
    "C": "Fair",
    "D": "Poor",
  };
  
  // Add rating nodes with positions calculated based on the number of ratings
  const ratings = Object.keys(rules.ratings);
  const ratingWidth = 200;
  const startX = 400 - ((ratings.length - 1) * ratingWidth) / 2;
  
  ratings.forEach((rating, index) => {
    const ratingId = `rating-${rating}`;
    const x = startX + index * ratingWidth;
    
    // Add rating node
    nodes.push({
      id: ratingId,
      type: "ratingNode",
      position: { x, y: 160 },
      data: { 
        label: `Rating ${rating}`,
        rating,
        description: ratingDescriptions[rating] || "Custom",
        color: ratingColors[rating] || "#64748b"
      },
    });
    
    // Connect root to rating
    edges.push({
      id: `e-root-${rating.toLowerCase()}`,
      source: "root",
      target: ratingId,
      type: "smoothstep",
      animated: true,
      style: { stroke: '#94a3b8' },
      markerEnd: { type: "arrowclosed" },
    });
    
    const ratingData = rules.ratings[rating];
    let yOffset = 280;
    
    // Add common conditions group
    if (ratingData.common_conditions) {
      const commonGroupId = `${rating.toLowerCase()}-common`;
      nodes.push({
        id: commonGroupId,
        type: "conditionGroupNode",
        position: { x, y: yOffset },
        data: { 
          label: "Common Conditions",
          operation: ratingData.common_conditions.operation,
          parentRating: rating
        },
      });
      
      // Connect rating to common conditions
      edges.push({
        id: `e-${rating.toLowerCase()}-common`,
        source: ratingId,
        target: commonGroupId,
        type: "smoothstep",
        animated: true,
        style: { stroke: ratingColors[rating] || "#64748b" },
        markerEnd: { type: "arrowclosed" },
      });
      
      // Add individual conditions
      ratingData.common_conditions.values.forEach((condition, condIndex) => {
        const conditionId = `${rating.toLowerCase()}-common-${condIndex + 1}`;
        const condX = x - 100 + (condIndex % 2) * 200; // Alternate left and right
        
        nodes.push({
          id: conditionId,
          type: "conditionNode",
          position: { x: condX, y: yOffset + 100 },
          data: { 
            name: condition.name,
            description: condition.description || condition.name,
            value: condition.value,
            operator: condition.operator,
            parentGroup: commonGroupId
          },
        });
        
        // Connect group to condition
        edges.push({
          id: `e-${rating.toLowerCase()}-common-${condIndex + 1}`,
          source: commonGroupId,
          target: conditionId,
          type: "smoothstep",
          animated: true,
          style: { stroke: '#64748b' },
          markerEnd: { type: "arrowclosed" },
        });
      });
      
      yOffset += 200;
    }
    
    // Add bureau nodes
    const bureaus = ["paynet", "dnb", "experian", "equifax"];
    bureaus.forEach((bureau, bureauIndex) => {
      if (ratingData[bureau]) {
        const bureauGroupId = `${rating.toLowerCase()}-${bureau}`;
        const bureauData = ratingData[bureau] as ConditionGroup;
        
        const bureauX = x - 200 + (bureauIndex % 3) * 200; // Position in a grid
        const bureauY = yOffset + Math.floor(bureauIndex / 3) * 200;
        
        nodes.push({
          id: bureauGroupId,
          type: "bureauNode",
          position: { x: bureauX, y: bureauY },
          data: { 
            label: bureau.charAt(0).toUpperCase() + bureau.slice(1),
            bureau,
            operation: bureauData.operation,
            parentRating: rating
          },
        });
        
        // Connect rating to bureau
        edges.push({
          id: `e-${rating.toLowerCase()}-${bureau}`,
          source: ratingId,
          target: bureauGroupId,
          type: "smoothstep",
          animated: true,
          style: { stroke: ratingColors[rating] || "#64748b" },
          markerEnd: { type: "arrowclosed" },
        });
        
        // Add bureau conditions
        bureauData.values.forEach((condition, condIndex) => {
          const scoreId = `${rating.toLowerCase()}-${bureau}-${condIndex + 1}`;
          
          nodes.push({
            id: scoreId,
            type: "scoreNode",
            position: { x: bureauX, y: bureauY + 100 },
            data: { 
              name: condition.name,
              value: condition.value,
              operator: condition.operator,
              applyScoreAdjustment: condition.apply_score_adjustment || false,
              parentBureau: bureauGroupId
            },
          });
          
          // Connect bureau to score
          edges.push({
            id: `e-${rating.toLowerCase()}-${bureau}-${condIndex + 1}`,
            source: bureauGroupId,
            target: scoreId,
            type: "smoothstep",
            animated: true,
            style: { stroke: '#64748b' },
            markerEnd: { type: "arrowclosed" },
          });
        });
      }
    });
  });
  
  return { nodes, edges };
};

// Sample data for testing
export const sampleCreditRules: CreditRules = {
  ratings: {
    AA: {
      common_conditions: {
        operation: "AND",
        values: [
          {
            name: "years_in_business",
            description: "Years in business of the business",
            value: 7,
            operator: ">=",
          },
          {
            name: "number_of_trades",
            description: "Number of trades of the business",
            value: 10,
            operator: ">=",
          },
          {
            name: "total_trades_amount",
            description: "High Credit Amount coming from the bureaus (Cents)",
            value: 2500000,
            operator: ">=",
          },
        ],
      },
      score_adjustment: [
        {
          years_range: { begin: 0, end: 9 },
          score_to_subtract: 0,
          string: "No adjustment to bureau threshold scores.",
        },
        {
          years_range: { begin: 10, end: 14 },
          score_to_subtract: 5,
          string: "For businesses operating 10 to 14 years, score thresholds except Paydex are reduced by 5 points.",
        },
      ],
      paynet: {
        operation: "AND",
        values: [
          {
            name: "master_score",
            apply_score_adjustment: true,
            value: 700,
            operator: ">=",
          },
        ],
      },
    },
    A: {
      common_conditions: {
        operation: "AND",
        values: [
          {
            name: "years_in_business",
            description: "Years in business of the business",
            value: 5,
            operator: ">=",
          },
          {
            name: "number_of_trades",
            description: "Number of trades of the business",
            value: 5,
            operator: ">=",
          },
        ],
      },
      dnb: {
        operation: "AND",
        values: [
          {
            name: "paydex_score",
            apply_score_adjustment: false,
            value: 70,
            operator: ">=",
          },
          {
            name: "ccs_percentile",
            apply_score_adjustment: false,
            value: 70,
            operator: ">=",
          },
        ],
      },
    },
  },
};
