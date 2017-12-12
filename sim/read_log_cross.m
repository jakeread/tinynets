% clear;clc;close all

D_INIT = 1e3;

arr = zeros(0,4);
fh = fopen('log_cross_5k.txt');
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
arr = arr(end-499:end,end);

hist(arr)
xlabel('RTT/hop [\mus]')
set(gca,'ytick',[])