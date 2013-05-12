var sigInst;
function init() {
  // Instanciate sigma.js and customize rendering :
  sigInst = sigma.init(document.getElementById('graph')).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 14,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    labelThreshold: 6,
    defaultEdgeType: 'curve'
  }).graphProperties({
    minNodeSize: 0.5,
    maxNodeSize: 5,
    minEdgeSize: 1,
    maxEdgeSize: 1
  }).mouseProperties({
    maxRatio: 200
  });

  // Parse a GEXF encoded file to fill the graph
  // (requires "sigma.parseGexf.js" to be included)
  sigInst.parseGexf('data/subreddits.gexf');

  // Bind events :
  var hideUnconnected = function(event){
    var nodes = event.content;
    var neighbors = {};
    sigInst.iterEdges(function(e){
      if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
        neighbors[e.source] = 1;
        neighbors[e.target] = 1;
      }
    }).iterNodes(function(n){
      if(!neighbors[n.id]){
        n.hidden = 1;
      }else{
        n.hidden = 0;
        n.active = true;
      }
    }).draw(2,2,2);
  };

  var showUnconnected = function(){
    sigInst.iterEdges(function(e){
      e.hidden = 0;
    }).iterNodes(function(n){
      n.hidden = 0;
      n.active = false;
    }).draw(2,2,2);
  };
  
  var highlightConnected = function(event){
    var nodes = event.content;
    var neighbors = {};
    sigInst.iterEdges(function(e){
      if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
        neighbors[e.source] = 1;
        neighbors[e.target] = 1;
      }
    }).iterNodes(function(n){
      if(neighbors[n.id]){
        n.active = true;
      }
    }).draw(2,2,2);
  };

  var unhighlightConnected = function(){
    sigInst.iterNodes(function(n){
      n.active = false;
    }).draw(2,2,2);
  };

  sigInst.bind('upnodes', function(event) {
    var subreddit = sigInst.getNodes(event.content[0]).label;
    window.open("http://www.reddit.com/r/" + subreddit, "_blank");
  });
  
  sigInst.bind('overnodes', highlightConnected).bind('outnodes', unhighlightConnected);
  $(document.getElementById('toggle-hiding')).data('toggle', false);

  document.getElementById('toggle-hiding').addEventListener('click',function(event){
    var button = $(event.target)
    var toggle = button.data('toggle');
    if (toggle) {
      sigInst.unbind('overnodes',hideUnconnected).unbind('outnodes',showUnconnected);
      sigInst.bind('overnodes',highlightConnected).bind('outnodes',unhighlightConnected);
      button.html("Hide unconnected networks");
    }
    else {
      sigInst.unbind('overnodes',highlightConnected).unbind('outnodes',unhighlightConnected);
      sigInst.bind('overnodes',hideUnconnected).bind('outnodes',showUnconnected);
      button.html("Always show all networks");
    }
    $(event.target).data('toggle', !toggle);
  },true);
  document.getElementById('reset-graph').addEventListener('click',function(){
    sigInst.position(0,0,1).draw();
  },true);

  // Draw the graph :
  sigInst.activateFishEye().draw();
}


if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", init, false);
} else {
  window.onload = init;
}

