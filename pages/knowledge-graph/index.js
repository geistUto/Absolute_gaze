import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { useRouter } from 'next/router'; 

const KnowledgeGraph = () => {
  const [realmData, setRealmData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchKnowledgeGraph = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/mind-snippets/realms/engagement/graphical`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const realms = response.data.data;
        setRealmData(realms);
      } catch (error) {
        console.error('Error fetching realms:', error);
      }
    };
    fetchKnowledgeGraph();
  }, []);

  useEffect(() => {
    if (realmData.length > 0) {
      createForceDirectedGraph();
    }
  }, [realmData]);

  const createForceDirectedGraph = () => {
    d3.select('#knowledgeGraph').selectAll('*').remove(); // Clear existing SVG content
    
    const width = window.innerWidth * 1;
    const height = window.innerHeight * 0.9;
  
    let zoomLevel = 1; // Initial zoom level
  
    const svg = d3.select('#knowledgeGraph')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'transparent')
      .call(d3.zoom().on('zoom', (event) => {
        zoomLevel = event.transform.k; // Capture the zoom level
        svg.attr('transform', event.transform);
        simulation.force('collision', d3.forceCollide().radius(d => (radius(d) + padding) / zoomLevel)); // Adjust collision radius based on zoom
        simulation.alpha(0.3).restart(); // Reheat simulation when zoom changes to reapply forces
      }))
      .append('g');
  
    const nodes = realmData.map(d => ({
      id: d.realmName.trim(),
      snippetCount: d.snippetCount,
      realmId: d.realmId, 
      parentRealm: d.parentRealmName.trim(),
    }));
  
    const parentNodes = [...new Set(realmData.map(d => d.parentRealmName.trim()))]
      .filter(name => name !== 'None')
      .map(name => ({ id: name }));
  
    const allNodes = [...nodes, ...parentNodes];
  
    const links = realmData
      .filter(d => d.parentRealmName && d.parentRealmName.trim() !== 'None')
      .map(d => ({
        source: d.parentRealmName.trim(),
        target: d.realmName.trim(),
      }));
  
    const radius = d => Math.sqrt(d.snippetCount || 1) * 8;
    const padding = 5; 
  
    // Generate unique colors for parent realms
    const parentRealmColors = d3.scaleOrdinal(d3.schemeCategory10);
    const colorMap = {};
  
    // Assign colors to parent realms
    parentNodes.forEach((parent, index) => {
      colorMap[parent.id] = parentRealmColors(index); // Assign a unique color
    });
  
    // Create a function to generate lighter shades for child realms
    const getChildRealmColor = (parentRealm, factor = 0.5) => {
      const parentColor = d3.color(colorMap[parentRealm]);
      return d3.interpolateRgb(parentColor, '#ffffff')(factor); // Blend towards white for lighter shades
    };
  
    const simulation = d3.forceSimulation(allNodes)
      .alphaDecay(0.05)
      .velocityDecay(0.8)
      .force('link', d3.forceLink(links).id(d => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => radius(d) + padding));
  
    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#888')
      .style('pointer-events', 'none');
  
    const node = svg.append('g')
      .selectAll('circle')
      .data(allNodes)
      .join('circle')
      .attr('r', d => radius(d))
      .attr('fill', d => {
        // If node is a child realm, derive its color from the parent
        return d.parentRealm && d.parentRealm !== 'None' ? getChildRealmColor(d.parentRealm) : colorMap[d.id];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .on('click', (event, d) => {
        if (d.realmId) {
          router.push(`/realms/${d.realmId}`);
        }
      })
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));
  
    const text = svg.append('g')
      .selectAll('text')
      .data(allNodes)
      .join('text')
      .attr('x', 6)
      .attr('y', 3)
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text(d => d.id);
  
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
  
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
  
      text
        .attr('x', d => d.x + 6)
        .attr('y', d => d.y + 3);
    });
  };
  
  

  return <svg id="knowledgeGraph"></svg>;
};

export default KnowledgeGraph;
