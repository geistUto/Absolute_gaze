import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { useRouter } from 'next/router'; // For navigation in Next.js

const KnowledgeGraph = () => {
  const [realmData, setRealmData] = useState([]);
  const router = useRouter(); // Initialize the router for redirection

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
      realmId: d.realmId, // Store realmId for redirection
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
  
    // Precompute radius
    const radius = d => Math.sqrt(d.snippetCount || 1) * 8;
  
    const padding = 5; // Add some padding for collision
  
    // Increase the distance between nodes, adjust link distance and charge strength
    const simulation = d3.forceSimulation(allNodes)
      .alphaDecay(0.05) // Slower decay for smoother simulation
      .velocityDecay(0.8) // Less velocity decay for smoother node movement
      .force('link', d3.forceLink(links).id(d => d.id).distance(200)) // Increase link distance for spacing
      .force('charge', d3.forceManyBody().strength(-500)) // Increase repelling force for more space between nodes
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => radius(d) + padding)); // Default collision radius
  
    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#888')
      .style('pointer-events', 'none'); // Disable pointer events for better performance
  
    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(allNodes)
      .join('circle')
      .attr('r', d => radius(d))
      .attr('fill', '#69b3a2')
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
  
    // Draw labels
    const text = svg.append('g')
      .selectAll('text')
      .data(allNodes)
      .join('text')
      .attr('x', 6)
      .attr('y', 3)
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text(d => d.id);
  
    // Run simulation
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
