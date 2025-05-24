import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

/**
 * TreeVisualizer
 * Props:
 *   data: hierarchical tree data in d3.hierarchy-compatible format
 *   width, height: dimensions of the SVG
 */
export default function TreeVisualizer({ data, width = 800, height = 600, margin = { top: 40, right: 40, bottom: 40, left: 40 } }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([
      width - margin.left - margin.right,
      height - margin.top - margin.bottom,
    ]);
    treeLayout(root);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Group for transform
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#2e495c')
      .attr('stroke-width', 1.5);

    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
      .attr('r', 6)
      .attr('fill', d => d.children ? '#61a0bf' : '#ffcc00');

    node.append('text')
      .attr('dy', 3)
      .attr('x', d => d.children ? -10 : 10)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name)
      .attr('font-family', 'Ancizar Sans, sans-serif')
      .attr('font-size', '0.9rem')
      .attr('fill', '#2e495c');

  }, [data, width, height, margin]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ background: 'transparent', overflow: 'visible' }}
    />
  );
}
