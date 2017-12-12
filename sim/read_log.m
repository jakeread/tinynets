clear;clc;close all

D_INIT = 25e3;

arr = zeros(0,4);
fh = fopen('log.txt');
line = fgetl(fh);
while ischar(line)
    line = regexp(line,'\[(\d+)\]: (\d+): got ACK from (\d+). RTT = (\d+.?\d*)','tokens');
    if ~isempty(line)
        arr(end+1,:) = cellfun(@str2double,line{:});
    end

    line = fgetl(fh);
end
fclose(fh);

arr(arr(:,1)<D_INIT,:) = [];
k1 = arr(arr(:,2)==0,end);
k2 = arr(arr(:,2)==1 | arr(:,2)==2 | arr(:,2)==3,end);
k3 = arr(arr(:,2)>3,end);

num = max([numel(k1),numel(k2),numel(k3)]);
k1 = repmat(k1,ceil(num/numel(k1)),1);
k2 = repmat(k2,ceil(num/numel(k2)),1);
k3 = repmat(k3,ceil(num/numel(k3)),1);
k1 = k1(1:num)/1e3;
k2 = k2(1:num)/1e3;
k3 = k3(1:num)/1e3;

arr = [k1,k2,k3]*1e3;

hist(arr)
xlabel('RTT/hop [\mus]')
% title('PDFs of Message Transmission Time')
legend(['Drill-Down: \sigma=' num2str(round(std(k1)*1e3)) '\mus'] ...
      ,['Controller: \sigma=' num2str(round(std(k2)*1e3)) '\mus'] ...
      ,['Motor-Encoder: \sigma=', num2str(round(std(k3)*1e3)) '\mus'])
set(gca,'ytick',[])