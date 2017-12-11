clear;clc;close all

arr = zeros(0,3);
fh = fopen('log.txt');
line = fgetl(fh);
while ischar(line)
    line = regexp(line,'(\d+): got ACK from (\d+). RTT = (\d+.?\d*)','tokens');
    if ~isempty(line)
        arr(end+1,:) = cellfun(@str2double,line{:});
    end

    line = fgetl(fh);
end
fclose(fh);

hist(arr(:,end))
xlabel('RTT/hopcount [ms]')
ylabel('PDF')
% subplot(1,3,1)
% hist(arr(arr(:,1)==0,end))
% subplot(1,3,2)
% hist(arr(arr(:,1)==1 | arr(:,1)==2,end))
% subplot(1,3,3)
% hist(arr(arr(:,1)>2,end))