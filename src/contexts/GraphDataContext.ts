import React from 'react';

import { PointData } from '../components/BasisCurve';

export interface GraphData {
	canvasSize: PointData;
	canvasOrigin: PointData;
	canvasBoundingRect: PointData;
}

const GraphDataContext = React.createContext<GraphData>({
	canvasSize: [0, 0],
	canvasOrigin: [0, 0],
	canvasBoundingRect: [0, 0],
});

export default GraphDataContext;
