function random_networks(n,max_out_degree,max_length)
%% Code modified from:
% Copyright (c) 2010, huxp ??
% All rights reserved.
% 
% Redistribution and use in source and binary forms, with or without
% modification, are permitted provided that the following conditions are
% met:
% 
%     * Redistributions of source code must retain the above copyright
%       notice, this list of conditions and the following disclaimer.
%     * Redistributions in binary form must reproduce the above copyright
%       notice, this list of conditions and the following disclaimer in
%       the documentation and/or other materials provided with the distribution
% 
% THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
% AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
% IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
% ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
% LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
% CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
% SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
% INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
% CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
% ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
% POSSIBILITY OF SUCH DAMAGE.

rng(0)
edge_list = zeros(0,2);
r=0;
out_arc=zeros(max_out_degree,2);
for i=1:n-1
    end_node=i+unidrnd(max_length,1,max(unidrnd(max_out_degree),1));
    end_node=end_node(end_node<=n);
    if isempty(end_node)
        end_node=n;
    end
    end_node = unique(end_node, 'first');
    l_end_node=length(end_node);
    out_arc(1:l_end_node,1)=i;
    out_arc(1:l_end_node,2)=end_node;
    edge_list(r+1:r+l_end_node,:) = out_arc(1:l_end_node,:);
    r=r+l_end_node;
end

%% Original code
topology = cell(max(max(edge_list)),1);
for i = 1:length(edge_list)
    topology{edge_list(i,1)} = [topology{edge_list(i,1)},edge_list(i,2)];
    topology{edge_list(i,2)} = [topology{edge_list(i,2)},edge_list(i,1)];
end

fh = fopen('js_code.txt','w');
fprintf(fh,'var initTopology = [\n');
for i = 1:numel(topology)
    fprintf(fh,'\t[%d',topology{i}(1)-1);
    for j = 2:numel(topology{i})
        fprintf(fh,',%d',topology{i}(j)-1);
    end
    fprintf(fh,']');
    if i ~= length(topology)
        fprintf(fh,',');
    end
    fprintf(fh,'\t\t// %d\n',i-1);
end
fprintf(fh,'];');
fclose(fh);
end