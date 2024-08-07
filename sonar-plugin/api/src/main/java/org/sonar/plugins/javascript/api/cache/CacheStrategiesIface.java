package org.sonar.plugins.javascript.api.cache;

import java.io.IOException;
import javax.annotation.Nullable;
import org.sonar.api.batch.fs.InputFile;
import org.sonar.api.batch.sensor.SensorContext;
import org.sonar.api.scanner.ScannerSide;
import org.sonarsource.api.sonarlint.SonarLintSide;

@ScannerSide
@SonarLintSide
public interface CacheStrategiesIface {
  default CacheStrategy getStrategyFor(SensorContext context, InputFile inputFile) throws IOException {
    return getStrategyFor(context, inputFile, null);
  }

  CacheStrategy getStrategyFor(SensorContext context, InputFile inputFile, @Nullable String pluginVersion) throws IOException;



  enum Noop implements CacheStrategiesIface {
    Instance;

    @Override
    public CacheStrategy getStrategyFor(SensorContext context, InputFile inputFile, @Nullable String pluginVersion) {
      return new CacheStrategy() {
        @Override
        public boolean isAnalysisRequired() {
          return true;
        }

        @Override
        public void writeAnalysisToCache(CacheAnalysis analysis, InputFile file) throws IOException {

        }

        @Override
        public CacheAnalysis readAnalysisFromCache() {
          return null;
        }
      };
    }
  }
}
