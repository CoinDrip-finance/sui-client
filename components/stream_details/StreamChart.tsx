import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridColumns, GridRows } from '@visx/grid';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, Line } from '@visx/shape';
import { defaultStyles, Tooltip, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { bisector, extent, max } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';

import { IChartSegment, ISegment, IStreamResource } from '../../types';
import { CoinMetadata } from '@mysten/sui/dist/cjs/client';
import { extractTokenName, getAmountStreamed, getClaimedAmount } from '../../utils/presentation';

interface AppleStock {
  date: string;
  close: number;
}

type TooltipData = AppleStock;

export const background = "#171717";
export const background2 = "#171717";
export const accentColor = "#0296FF";
export const accentColorDark = "white";
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid white",
  color: "white",
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const mapSegments = (startDate: number, decimals: number, segments: ISegment[]): IChartSegment[] => {
  let segmentStartDate = moment(startDate);
  let segmentAmount = new BigNumber(0);
  let chartSegments: IChartSegment[] = [];
  segments.forEach((segment) => {
    const segmentEndDate = segmentStartDate.clone();

    chartSegments.push({
      ...segment,
      startDate: segmentStartDate.clone(),
      endDate: segmentEndDate.add(segment.duration, "seconds"),
      startAmount: segmentAmount.shiftedBy(-decimals).toNumber(),
      endAmount: segmentAmount.plus(segment.amount).shiftedBy(-decimals).toNumber(),
      denominatedAmount: new BigNumber(segment.amount).shiftedBy(-decimals).toNumber(),
    });

    segmentStartDate.add(segment.duration, "s");
    segmentAmount = segmentAmount.plus(segment.amount);
  });

  return chartSegments;
};

const generatePointsFromSegments = (cliff: number, segments: IChartSegment[]): AppleStock[] => {
  const points: AppleStock[] = [];
  const startDate = segments[0].startDate.clone();
  const cliffEnd = startDate.add(cliff, "s");

  segments.forEach((segment) => {
    for (let i = 0; i <= 100; i++) {
      const pointDuration = (i * segment.duration) / 100;
      const pointAmount = Math.pow(i / 100, segment.exponent) * segment.denominatedAmount;
      const pointDate = segment.startDate.clone().add(pointDuration, "s");
      if (pointDate > cliffEnd) {
        points.push({
          date: pointDate.toString(),
          close: segment.startAmount + pointAmount,
        });
      } else {
        points.push({
          date: pointDate.toString(),
          close: 0,
        });
      }
    }
  });

  return points;
};

export default withTooltip<AreaProps & { stream: IStreamResource; tokenMetadata: CoinMetadata }, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    stream,
    tokenMetadata
  }: AreaProps & WithTooltipProvidedProps<TooltipData> & { stream: IStreamResource; tokenMetadata: CoinMetadata }) => {
    if (width < 10) return null;

    const stock = useMemo(() => {
      const chartSegments = mapSegments(
        stream.start_time,
        tokenMetadata?.decimals || 9,
        // @ts-ignore
        stream.segments.map(s => {
          return {
            ...s,
            duration: s.duration / 1000,
          }
        })
      );
      return generatePointsFromSegments(parseInt(stream.cliff) / 1000, chartSegments);
    }, [stream, tokenMetadata]);

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left]
    );
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, max(stock, getStockValue) || 0],
          nice: true,
        }),
      [margin.top, innerHeight]
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(stock, x0, 1);
        const d0 = stock[index - 1];
        const d1 = stock[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale]
    );

    return (
      <div className="mt-8">
        <div className="text-neutral-400 mb-1">Emission</div>

        <svg width={width} height={height} className="rounded-2xl border border-neutral-800">
          <rect x={0} y={0} width={width} height={height} fill="url(#area-background-gradient)" rx={14} />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
          <LinearGradient id="area-gradient-low-opacity" from={accentColor} to={accentColor} fromOpacity={0.1} toOpacity={0.1} />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          {(() => {
            const splitIndex = Math.floor(stock.length * parseInt(getClaimedAmount(stream, tokenMetadata).percent) / 100); // 20% of the points
            const first20Percent = stock.slice(0, splitIndex + 1); // Include the split point
            const remaining80Percent = stock.slice(splitIndex); // Start from the split point

            return (
              <>
                <AreaClosed<AppleStock>
                  data={first20Percent}
                  x={(d) => dateScale(getDate(d)) ?? 0}
                  y={(d) => stockValueScale(getStockValue(d)) ?? 0}
                  yScale={stockValueScale}
                  strokeWidth={1}
                  stroke="url(#area-gradient-low-opacity)"
                  fill="url(#area-gradient-low-opacity)"
                  curve={curveMonotoneX}
                />
                <AreaClosed<AppleStock>
                  data={remaining80Percent}
                  x={(d) => dateScale(getDate(d)) ?? 0}
                  y={(d) => stockValueScale(getStockValue(d)) ?? 0}
                  yScale={stockValueScale}
                  strokeWidth={1}
                  stroke="url(#area-gradient)"
                  fill="url(#area-gradient)"
                  curve={curveMonotoneX}
                />
              </>
            );
          })()}

          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />

          <Line
            from={{ x: dateScale(new Date()), y: margin.top }}
            to={{ x: dateScale(new Date()), y: innerHeight + margin.top }}
            stroke="red"
            strokeWidth={1}
            strokeOpacity={1}
            pointerEvents="none"
            strokeDasharray="5,2"
          />

          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds key={Math.random()} top={tooltipTop - 60} left={tooltipLeft} style={tooltipStyles}>
              {`${getStockValue(tooltipData).toFixed(2)} ${extractTokenName(stream.token)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 4}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: "center",
                transform: "translateX(-50%)",
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);
