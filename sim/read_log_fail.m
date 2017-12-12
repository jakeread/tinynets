clear;clc;close all
global D_INIT D_FAIL

D_INIT = 1e3;
D_FAIL = 11e3;

plotlog('log_cross_1f.txt')
hold on
plotlog('log_cross_2f.txt')
hold on
plotlog('log_cross_3f.txt')
plotlog('log_cross_4f.txt')
plot([D_FAIL,D_FAIL]/1e3,[0,200],'k')
hold off
ylim([0,200])
xlabel('Time (ms)')
ylabel('RTT/hop (\mus)')
legend('1 Node Failure, T_r=1.3ms','2 Node Failures, T_r=1.9ms','3 Node Failures, T_r=3.9ms','4 Node Failures, fatal')
text(12,20,'Node Failure')

function plotlog(fn)
global D_INIT D_FAIL
arr = zeros(0,4);
fh = fopen(fn);
line = fgetl(fh);
while ischar(line)
    line = regexp(line,'\[(\d+)\]: (\d+): got ACK from (\d+). RTT = (\d+.?\d*)','tokens');
    if ~isempty(line)
        arr(end+1,:) = cellfun(@str2double,line{:});
    end

    line = fgetl(fh);
end
fclose(fh);

if any(fn=='1')
    plot(arr(arr(:,1)>=D_INIT,1)/1000,smooth(arr(arr(:,1)>=D_INIT,end)))
else
    plot(arr(arr(:,1)>=D_FAIL,1)/1000,smooth(arr(arr(:,1)>=D_FAIL,end)))
end
end