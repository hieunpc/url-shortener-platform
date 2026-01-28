import { useState } from 'react';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UrlData } from '@/hooks/useUrls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UrlStatsChartProps {
  url: UrlData;
}

type ViewMode = 'day' | 'week';

const UrlStatsChart = ({ url }: UrlStatsChartProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const { t, language } = useLanguage();
  const dateLocale = language === 'vi' ? vi : enUS;

  const getDailyData = () => {
    const end = new Date();
    const start = subDays(end, 6);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const historyEntry = url.clickHistory.find((h) => h.date === dateStr);
      return {
        date: format(day, 'dd/MM', { locale: dateLocale }),
        fullDate: format(day, 'EEEE, dd MMM', { locale: dateLocale }),
        clicks: historyEntry?.count || 0,
      };
    });
  };

  const getWeeklyData = () => {
    const end = new Date();
    const start = subWeeks(end, 3);
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

    return weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const weekClicks = daysInWeek.reduce((total, day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const historyEntry = url.clickHistory.find((h) => h.date === dateStr);
        return total + (historyEntry?.count || 0);
      }, 0);

      return {
        date: `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`,
        fullDate: `${language === 'vi' ? 'Tuần' : 'Week'} ${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM', { locale: dateLocale })}`,
        clicks: weekClicks,
      };
    });
  };

  const data = viewMode === 'day' ? getDailyData() : getWeeklyData();
  const maxClicks = Math.max(...data.map((d) => d.clicks), 1);

  return (
    <Card className="border-border/50 mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            {t('stats.title')}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="text-xs h-7 px-2"
            >
              {t('stats.7days')}
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="text-xs h-7 px-2"
            >
              {t('stats.4weeks')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${url.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                domain={[0, maxClicks + 1]}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-xs text-muted-foreground">{data.fullDate}</p>
                        <p className="text-sm font-medium text-foreground">
                          {data.clicks} {t('dashboard.clicks')}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill={`url(#gradient-${url.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlStatsChart;
